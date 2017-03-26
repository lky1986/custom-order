package com.order.web.swagger;

import static com.google.common.base.Predicates.or;
import static springfox.documentation.builders.PathSelectors.regex;

import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import com.google.common.base.Predicate;

import springfox.documentation.annotations.ApiIgnore;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * Created by max on 8/16/16.
 *
 */
@EnableWebMvc
@EnableSwagger2
public class SwaggerConfiguration {

	 @Bean
    public Docket petApi() {
        return new Docket(DocumentationType.SWAGGER_2)
                .groupName("full-petstore-api")
                .apiInfo(apiInfo())
                .select()
                .paths(petstorePaths())
                .build();
    }

    @Bean
    public Docket categoryApi() {
        return new Docket(DocumentationType.SWAGGER_2)
                .groupName("category-api")
                .apiInfo(apiInfo())
                .select()
                .paths(categoryPaths())
                .build()
                .ignoredParameterTypes(ApiIgnore.class)
                .enableUrlTemplating(true);
    }

    private Predicate<String> categoryPaths() {
        return regex("/user.*");
    }
    
    private Predicate<String> petstorePaths() {
        return or(
                regex("/back.*")
        );
    }
    
    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("Springfox petstore API")
                .description("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum " +
                        "has been the industry's standard dummy text ever since the 1500s, when an unknown printer "
                        + "took a " +
                        "galley of type and scrambled it to make a type specimen book. It has survived not only five " +
                        "centuries, but also the leap into electronic typesetting, remaining essentially unchanged. " +
                        "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum " +
                        "passages, and more recently with desktop publishing software like Aldus PageMaker including " +
                        "versions of Lorem Ipsum.")
                .termsOfServiceUrl("http://springfox.io")
                .contact("springfox")
                .license("Apache License Version 2.0")
                .licenseUrl("https://github.com/springfox/springfox/blob/master/LICENSE")
                .version("2.0")
                .build();
    }
}