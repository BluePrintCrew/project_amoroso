package org.example.amorosobackend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.MOCK, // 내장 톰캣 같은 실제 서버를 띄우지 않고, mock 서블릿 환경으로 웹 레이어 테스트를 가능하게 한다.
    properties = {
        "spring.main.banner-mode=off"
    }
)
@AutoConfigureMockMvc // 실제 요청없이 컨트롤러 동작을 테스트 할 수 있다. MockMvc 객체 자동구성
@ActiveProfiles("test") // DB, 시크릿 키, OAuth 설정등을 테스트 환경에서 사용할 수 있게 한다.
class AmorosoBackendApplicationTests {

    @Test
    void contextLoads() {
        // This test will succeed if the application context loads successfully
        assertTrue(true);
    }
}
