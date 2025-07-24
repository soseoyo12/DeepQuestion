package com.deepquestion;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DeepQuestionApplication {

    public static void main(String[] args) {
        // UTF-8 인코딩 설정
        System.setProperty("file.encoding", "UTF-8");
        SpringApplication.run(DeepQuestionApplication.class, args);
    }
}