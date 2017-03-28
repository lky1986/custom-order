package com.order.core.cache;

import java.util.ArrayList;
import java.util.concurrent.TimeUnit;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.guava.GuavaCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import com.google.common.cache.CacheBuilder;

/**
 * Cache配置類，用于缓存方法返回的数据
 *
 */
@Configuration
@EnableCaching
public class CacheConfig {

    public static final int DEFAULT_MAXSIZE = 50000;
    public static final int DEFAULT_TTL = 10;

    /**
     * 定義cache名稱、超時時長（秒）、最大size
     * 每个cache缺省10秒超时、最多缓存50000条数据，需要修改可以在构造方法的参数中指定。
     */
    public enum Caches{
        messageContent(8640000),
        getSomeData,
        qiniuUpToken(1800, 1),

        getCommonAds(10),
        getAndAssembleAreaSpecificAds(60);

        Caches() {
        }

        Caches(int ttl) {
            this.ttl = ttl;
        }

        Caches(int ttl, int maxSize) {
            this.ttl = ttl;
            this.maxSize = maxSize;
        }

        private int maxSize=DEFAULT_MAXSIZE;    //最大數量
        private int ttl=DEFAULT_TTL;        //过期时间（秒）

        public int getMaxSize() {
            return maxSize;
        }
        public void setMaxSize(int maxSize) {
            this.maxSize = maxSize;
        }
        public int getTtl() {
            return ttl;
        }
        public void setTtl(int ttl) {
            this.ttl = ttl;
        }
    }

    /**
     * 创建基于guava的Cache Manager
     * @return
     */
    @Bean("cacheManager")
    @Primary
    public CacheManager guavaCacheManager() {
    	
        SimpleCacheManager cacheManager = new SimpleCacheManager();

        //把各个cache注册到cacheManager中，GuavaCache实现了org.springframework.cache.Cache接口
        ArrayList<GuavaCache> caches = new ArrayList<GuavaCache>();
        for(Caches c : Caches.values()){
            caches.add(new GuavaCache(c.name(), CacheBuilder.newBuilder().recordStats().expireAfterWrite(c.getTtl(), TimeUnit.SECONDS).maximumSize(c.getMaxSize()).build()));
        }
        cacheManager.setCaches(caches);
        return cacheManager;
    }

    
}