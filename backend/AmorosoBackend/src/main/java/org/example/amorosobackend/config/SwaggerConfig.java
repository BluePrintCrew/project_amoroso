package org.example.amorosobackend.config;

import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public GroupedOpenApi ProductGroupedOpenApi() {
        return GroupedOpenApi
                .builder()
                .group("default") // group 설정 (API들을 그룹화시켜 그룹에 속한 API들만 확인할 수 있도록 도와줌)
                .pathsToMatch("/api/v1/**") // group에 포함될 API endpoint 경로
                .addOpenApiCustomizer(
                        openApi ->
                                openApi
                                        .setInfo(
                                                new Info()
                                                        .title("amorosoAPI") // API 제목
                                                        .description("my API") // API 설명
                                                        .version("1.0.4") // API 버전
                                        )
                )
                .build();
    }
}
/// 1.0.3 : 장바구니 로직추가
/// 1.0.4 : 상품등록 통합테스트 api
