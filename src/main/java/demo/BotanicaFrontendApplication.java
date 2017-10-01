package demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan
@EnableAutoConfiguration(exclude={MongoAutoConfiguration.class})
public class BotanicaFrontendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BotanicaFrontendApplication.class, args);
    }
}
