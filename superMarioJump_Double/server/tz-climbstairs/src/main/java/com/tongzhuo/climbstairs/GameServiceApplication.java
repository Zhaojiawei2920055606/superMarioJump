package com.tongzhuo.climbstairs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import com.tongzhuo.redis.RedisObjectSerializer;

@EnableDiscoveryClient
@SpringBootApplication
public class GameServiceApplication {

    public static void main(String[] args) throws Exception {
        ApplicationContext act = SpringApplication
                .run(GameServiceApplication.class, args);
        //初始化
        ApplicationStartup start = act.getBean(ApplicationStartup.class);
        start.init(act);
    }

    @Bean
    JedisConnectionFactory jedisConnectionFactory() {
        return new JedisConnectionFactory();
    }

    @Bean
    public RedisTemplate<String, byte[]> redisTemplate(
            RedisConnectionFactory factory) {
        RedisTemplate<String, byte[]> template = new RedisTemplate<String, byte[]>();
        template.setConnectionFactory(jedisConnectionFactory());
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new RedisObjectSerializer());
        return template;
    }

}
