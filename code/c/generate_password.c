#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <string.h>
#include <stdbool.h>

//密码复杂度要求：
//必须包含大写字母
//必须包含小写字母
//必须包含数字
//必须包含特殊字符
//功能特点：
//首先生成4个字符，分别来自小写字母、大写字母、数字和特殊字符
//然后随机填充剩余长度的字符
//最后打乱所有字符的顺序
//双重验证确保密码符合复杂度要求
//使用方法：
//运行程序后输入密码长度（至少8位）
//程序会生成并显示符合要求的随机密码
//可配置项：
//可以修改symbols字符串来改变允许的特殊字符
//可以调整密码生成策略


// 生成随机密码
void generatePassword(char *password, int length) {
    const char lowercase[] = "abcdefghijklmnopqrstuvwxyz";
    const char uppercase[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const char digits[] = "0123456789";
    const char symbols[] = "!@#$%^*()_+-=[]{}|;:,.?";
    //const char symbols[] = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    // 确保每种字符类型至少出现一次
    password[0] = lowercase[rand() % (sizeof(lowercase) - 1)];
    password[1] = uppercase[rand() % (sizeof(uppercase) - 1)];
    password[2] = digits[rand() % (sizeof(digits) - 1)];
    password[3] = symbols[rand() % (sizeof(symbols) - 1)];
    
    // 填充剩余部分
    const char all_chars[] = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^*()_+-=[]{}|;:,.?";
    
    for (int i = 4; i < length; i++) {
        password[i] = all_chars[rand() % (sizeof(all_chars) - 1)];
    }
    
    // 打乱密码顺序
    for (int i = 0; i < length; i++) {
        int j = rand() % length;
        char temp = password[i];
        password[i] = password[j];
        password[j] = temp;
    }
    
    password[length] = '\0';
}

// 检查密码复杂度
bool checkPasswordComplexity(const char *password) {
    bool hasLower = false, hasUpper = false, hasDigit = false, hasSpecial = false;
    
    for (int i = 0; password[i] != '\0'; i++) {
        if (password[i] >= 'a' && password[i] <= 'z') hasLower = true;
        else if (password[i] >= 'A' && password[i] <= 'Z') hasUpper = true;
        else if (password[i] >= '0' && password[i] <= '9') hasDigit = true;
        else hasSpecial = true;
    }
    
    return hasLower && hasUpper && hasDigit && hasSpecial;
}

int main(int argc , char* argv[]) {
    srand(time(NULL)); // 初始化随机数种子
    
    int length;
		if(argc < 2){
						return 2;
		}
if(sscanf(argv[1],"%d",&length)<1){
return 4;
};
    
    if (length < 8) {
        return 1;
    }
    
    char password[length + 1];
    
    generatePassword(password, length);
    
    // 确保生成的密码符合复杂度要求
    while (!checkPasswordComplexity(password)) {
        generatePassword(password, length);
    }
    
    printf("%s", password);
    //printf("密码长度: %lu\n", strlen(password));
    
    return 0;
}
