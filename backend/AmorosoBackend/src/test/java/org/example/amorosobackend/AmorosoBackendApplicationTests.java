package org.example.amorosobackend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.MOCK,
    properties = {
        "spring.main.banner-mode=off"
    }
)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AmorosoBackendApplicationTests {

    @Test
    void contextLoads() {
        // This test will succeed if the application context loads successfully
        assertTrue(true);
    }
}
