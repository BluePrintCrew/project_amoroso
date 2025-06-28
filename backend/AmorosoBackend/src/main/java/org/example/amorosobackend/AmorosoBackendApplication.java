package org.example.amorosobackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;

@SpringBootApplication
@PropertySource(value = {
    "file:../../infrastructure/scripts/env/dev.env",
    "file:../infrastructure/scripts/env/dev.env",
    "file:infrastructure/scripts/env/dev.env"
}, ignoreResourceNotFound = true)
public class AmorosoBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(AmorosoBackendApplication.class, args);
    }

}
