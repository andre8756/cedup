package com.conta.conta.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.ForwardedHeaderFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;

@Configuration
public class ForwardedHeaderConfig {

    @Bean
    public FilterRegistrationBean<ForwardedHeaderFilter> forwardedHeaderFilter() {
        FilterRegistrationBean<ForwardedHeaderFilter> filter = new FilterRegistrationBean<>(new ForwardedHeaderFilter());
        filter.setOrder(0);
        return filter;
    }
}
