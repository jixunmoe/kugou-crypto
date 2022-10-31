#include <iostream>
#include <vector>
#include <cstdint>
#include <cassert>

#include <ctype.h>
#include <stdio.h>

#include "md5.h"

// https://stackoverflow.com/a/29865
void hexdump(void* ptr, int buflen) {
    unsigned char* buf = (unsigned char*)ptr;
    int i, j;
    for (i = 0; i < buflen; i += 16) {
        printf("%06x: ", i);
        for (j = 0; j < 16; j++)
            if (i + j < buflen)
                printf("%02x ", buf[i + j]);
            else
                printf("   ");
        printf(" ");
        for (j = 0; j < 16; j++)
            if (i + j < buflen)
                printf("%c", isprint(buf[i + j]) ? buf[i + j] : '.');
        printf("\n");
    }
}

void decryption_65B8DCC1(uint64_t offset, std::vector<uint8_t> &data, std::vector<uint8_t> &key1, std::vector<uint8_t> &key2) {
    auto data_len = data.size();
    auto key1_len = key1.size();
    auto key2_len = key2.size();

    for (size_t i = 0; i < data_len; i++) {
        uint8_t preprocess = data[i] ^ key2[offset % key2_len];
        uint8_t temp = preprocess ^ uint8_t(preprocess << 4) ^ key1[offset % key1_len];
        temp ^= uint8_t(offset ^ (offset >> 16) ^ (offset >> 8) ^ (offset >> 24));
        data[i] = temp;

        offset++;
    }
}

// binary tree search:
//
// root = 194BA2F0
//           p_right      p_unknown    p_left         is_leaf
// 194BA2F0 [10 A1 4B 19] 10 A1 4B 19 [10 A1 4B 19]01[00]2D 00  .¡K..¡K..¡K...-.  
//           key_slot     vec_key_beg  vec_key_end
// 194BA300 [01 00 00 00][18 65 3B 0F][1C 65 3B 0F] 1C 65 3B 0F  .....e;..e;..e;.  
//
//           p_right                 p_left        is_leaf
// 194BA110 [F0 A2 4B 19]F0 A2 4B 19[F0 A2 4B 19]01[01]2D 00  ð¢K.ð¢K.ð¢K...-.  
// 194BA120  20 00 7B 30 5F 30 8B 30 6B 70 00 00 68 00 00 00   .{0_0.0kp..h...  

std::vector<uint8_t> kugou_key_by_keyslot(int key_slot) {
    switch (key_slot) {
    case 1:
        return std::vector<uint8_t>({ 0x6C, 0x2C, 0x2F, 0x27 });
    }

    return std::vector<uint8_t>();
}

std::vector<uint8_t> kugou_md5(std::vector<uint8_t> data) {
    auto digest = md5Buffer(data.data(), data.size());

    std::vector<uint8_t> result(16);
    for (int i = 0; i < 16; i+=2) {
        result[i] = digest[14 - i];
        result[i + 1] = digest[14 - i + 1];
    }

    free(digest);
    return result;
}

void decrypt_test_kgm() {
    // 
    std::vector<uint8_t> key1 = kugou_md5(kugou_key_by_keyslot(1));

    // file_content[0x2C..0x3C]
    std::vector<uint8_t> file_key_2 = {
        0x61, 0x41, 0xB9, 0x82, 0xE9, 0xB0, 0xE8, 0xC3, 0xD6, 0x87, 0xB5, 0xD7, 0xA9, 0xE2, 0x4B, 0x4F
    };
    std::vector<uint8_t> key2 = kugou_md5(file_key_2);
    key2.push_back(0x6b);

    std::vector<uint8_t> data = {
        0xB8, 0xA1, 0x68, 0xD8, 0xE9, 0x22, 0xCE, 0x51, 0x21, 0xF9, 0xB4, 0xE1, 0x7A, 0xF3, 0x45, 0x9E,
        0xB4, 0x9B, 0xAA, 0xD9, 0x83, 0xCE, 0x04, 0xF3, 0x2C, 0xA6, 0x4C, 0x57, 0x94, 0xF8, 0x81, 0x38,
        0xDB, 0x63, 0x83, 0x02, 0x2F, 0xBF, 0x54, 0xBE, 0xB5, 0x1C, 0xD3, 0x77, 0xA8, 0x75, 0x12, 0xD4,
    };

    decryption_65B8DCC1(0, data, key1, key2);

    hexdump(data.data(), data.size());
}

void decrypt_test_vpr() {
    std::vector<uint8_t> key1 = kugou_md5(kugou_key_by_keyslot(1));

    // file_content[0x2C..0x3C]
    std::vector<uint8_t> file_key_2 = {
        0x8F, 0x2A, 0x84, 0x17, 0x3D, 0x3E, 0x38, 0x1C, 0xD7, 0x91, 0x4F, 0x33, 0xD3, 0x63, 0x77, 0xD2
    };
    std::vector<uint8_t> key2 = kugou_md5(file_key_2);
    key2.push_back(0x6b);

    std::vector<uint8_t> data = {
        0xEE, 0x64, 0x97, 0x15, 0x43, 0x8A, 0x99, 0xE1, 0x06, 0xB5, 0xD4, 0xA5, 0xAD, 0xD9, 0xB9, 0x15,
        0x09, 0x78, 0xE3, 0xC8, 0xB6, 0x14, 0xBD, 0x56, 0x8A, 0x6F, 0xCE, 0x26, 0x91, 0xEB, 0xC5, 0x18,
        0x3B, 0xFB, 0x31, 0x36, 0x81, 0xC1, 0x03, 0x52, 0x1D, 0xA5, 0x5E, 0x89, 0x2A, 0x19, 0xE5, 0x60,
    };

    decryption_65B8DCC1(0, data, key1, key2);

    hexdump(data.data(), data.size());
}

int main() {
    printf("\n");
    decrypt_test_kgm();
    printf("\n");
    decrypt_test_vpr();
}
