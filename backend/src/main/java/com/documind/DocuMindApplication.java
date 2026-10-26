package com.documind;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class DocuMindApplication {
    public static void main(String[] args) {
        SpringApplication.run(DocuMindApplication.class, args);
    }
}
