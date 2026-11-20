#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <regex.h>

#define MAX_TEXT 65536

/*
# 依赖 poppler-utils（提供 pdftotext）
sudo apt install poppler-utils        # Debian/Ubuntu
# sudo yum install poppler-utils      # CentOS/RHEL
*/

// 提取 PDF 文本
int pdf_to_text(const char *pdf, const char *txt) {
    char cmd[512];
    snprintf(cmd, sizeof(cmd), "pdftotext -layout -enc UTF-8 \"%s\" \"%s\" 2>/dev/null", pdf, txt);
    return system(cmd);
}

// 辅助函数：提取正则匹配的第一个结果
void extract_regex(const char *text, const char *pattern, char *out, size_t outsz) {
    regex_t regex;
    regmatch_t match[1];
    out[0] = '\0';
    if (regcomp(&regex, pattern, REG_EXTENDED) == 0) {
        if (regexec(&regex, text, 1, match, 0) == 0) {
            int len = match[0].rm_eo - match[0].rm_so;
            if (len < (int)outsz) {
                strncpy(out, text + match[0].rm_so, len);
                out[len] = '\0';
            }
        }
        regfree(&regex);
    }
}

// 辅助函数：把一段文本中的所有连续空白（空格、换行、制表符）压缩为一个普通空格
void normalize_text(const char *src, char *dest, size_t max_len) {
    size_t j = 0;
    int in_space = 0;
    for (size_t i = 0; src[i] && j < max_len - 1; i++) {
        if (isspace((unsigned char)src[i])) {
            if (!in_space) {
                dest[j++] = ' ';
                in_space = 1;
            }
        } else {
            dest[j++] = src[i];
            in_space = 0;
        }
    }
    dest[j] = '\0';
}

int main(int argc, char *argv[]) {
    if (argc < 2) { fprintf(stderr, "用法: %s <发票.pdf>\n", argv[0]); return 1; }
    if (pdf_to_text(argv[1], "invoice_temp.txt") != 0) return 1;

    FILE *fp = fopen("invoice_temp.txt", "rb");
    if (!fp) { perror("fopen"); return 1; }
    static char text[MAX_TEXT];
    size_t n = fread(text, 1, MAX_TEXT - 1, fp);
    text[n] = '\0';
    fclose(fp);
    remove("invoice_temp.txt");

    printf("========== 发票解析结果 ==========\n");
    char buf[256];
    
    // 创建一个消除多余空行的纯净文本（把所有回车换行变成空格，方便正则跨行匹配）
    static char clean_text[MAX_TEXT];
    normalize_text(text, clean_text, MAX_TEXT);

    // 1. 发票号码 (直接找 20 位连续数字)
    extract_regex(text, "[0-9]{20}", buf, sizeof(buf));
    printf("发票号码：%s\n", buf[0] ? buf : "未识别");

    // 2. 发票类型
    printf("发票类型：");
    if (strstr(clean_text, "专用发票")) printf("增值税专用发票\n");
    else if (strstr(clean_text, "普通发票")) printf("增值税普通发票\n");
    else printf("未识别\n");

    // 3. 金额 (寻找带有 ¥ 符号且小数位为 .00 的数字，通常是价税合计)
    // 注意：PDF 中的 ¥ 可能是全角或半角，这里直接匹配特征
    extract_regex(clean_text, "¥ *([0-9,]+\\.00)", buf, sizeof(buf));
    // 如果没找到，退而求其次找任意带 ¥ 的数字
    if (!buf[0]) extract_regex(clean_text, "¥ *([0-9,]+\\.\\d{2})", buf, sizeof(buf));
    printf("金额（价税合计）：%s\n", buf[0] ? buf : "未识别");

    // 4. 税额 (明细行里的最后一组小数，或者利用“税额”关键词的下一个数字)
    // 这里我们用正则搜索 “9%” 后面跟随的数字
    extract_regex(clean_text, "9% *([0-9]+\\.[0-9]{2})", buf, sizeof(buf));
    if (!buf[0]) {
        // 兜底：找所有小数里最小的那个（通常对应税额）或者直接搜“税额”后面的数字
        extract_regex(clean_text, "税额 *([0-9]+\\.[0-9]{2})", buf, sizeof(buf));
    }
    printf("税额：%s\n", buf[0] ? buf : "未识别");

    // 5. 买卖方公司名称
    // 由于文本被乱空格打断，我们直接在干净文本里找 "名称: xxx公司"
    // "名称" 后面可能跟着冒号和空格，再抓取以“公司”结尾的字符串
    regex_t regex;
    regmatch_t matches[2];
    int found_company = 0;
    
    // 匹配规则：名称 -> 零或多个空格/冒号 -> 捕获组(非空白字符+公司)
    if (regcomp(&regex, "名称[:： ]*([^ :]+公司)", REG_EXTENDED) == 0) {
        const char *ptr = clean_text;
        while (regexec(&regex, ptr, 2, matches, 0) == 0) {
            int start = matches[1].rm_so;
            int end = matches[1].rm_eo;
            int len = end - start;
            if (len < 255) {
                strncpy(buf, ptr + start, len);
                buf[len] = '\0';
                if (found_company == 0) {
                    printf("被开票公司（购买方）：%s\n", buf);
                    found_company++;
                } else if (found_company == 1) {
                    printf("开票公司（销售方）：%s\n", buf);
                    found_company++;
                    break; // 找到两个就够了
                }
            }
            ptr += end; // 将指针移到匹配结束处，继续找下一个
        }
        regfree(&regex);
    }
    if (found_company == 0) {
        printf("被开票公司（购买方）：未识别\n");
        printf("开票公司（销售方）：未识别\n");
    } else if (found_company == 1) {
        printf("开票公司（销售方）：未识别\n");
    }

    // 6. 费用类型 (抓取第一个以 * 开头，且包含在第一个单引号/空格前的部分)
    // 从文本中找 "*基础电信服务*基础电信服务费"
    extract_regex(clean_text, "(\\*[^ ]+\\*[^ ]+)", buf, sizeof(buf));
    printf("费用类型：%s\n", buf[0] ? buf : "未识别");

    return 0;
}
