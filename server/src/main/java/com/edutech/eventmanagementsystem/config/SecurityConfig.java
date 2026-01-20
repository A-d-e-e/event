package com.edutech.eventmanagementsystem.config;
 
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.context.annotation.Bean;

import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.AuthenticationManager;

import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;

import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
 
import com.edutech.eventmanagementsystem.jwt.JwtRequestFilter;
 
@Configuration

@EnableWebSecurity

@EnableGlobalMethodSecurity(prePostEnabled = true)

public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final UserDetailsService userDetailsService;

    private final JwtRequestFilter jwtRequestFilter;

    private final PasswordEncoder passwordEncoder;
 
    @Autowired

    public SecurityConfig(UserDetailsService userDetailsService,

                          JwtRequestFilter jwtRequestFilter,

                          PasswordEncoder passwordEncoder) {

        this.userDetailsService = userDetailsService;

        this.jwtRequestFilter = jwtRequestFilter;

        this.passwordEncoder = passwordEncoder;

    }
 
 
    @Override

    protected void configure(AuthenticationManagerBuilder auth) throws Exception {

        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);

    }
 
    @Override

    protected void configure(HttpSecurity http) throws Exception {

        http.cors().and().csrf().disable()

                .authorizeRequests()
                .antMatchers(HttpMethod.POST, "/api/planner/messages").hasAuthority("PLANNER")
.antMatchers(HttpMethod.GET, "/api/planner/messages/**").hasAuthority("PLANNER")

// For STAFF
.antMatchers(HttpMethod.POST, "/api/staff/messages").hasAuthority("STAFF")
.antMatchers(HttpMethod.GET, "/api/staff/messages/**").hasAuthority("STAFF")
                .antMatchers("/api/otp/send","/api/otp/verify").permitAll()

                .antMatchers(HttpMethod.POST, "/api/user/register").permitAll()

                .antMatchers(HttpMethod.POST, "/api/user/login").permitAll()

                .antMatchers(HttpMethod.POST, "/api/planner/event").hasAuthority("PLANNER")

                .antMatchers(HttpMethod.GET, "/api/planner/events").hasAuthority("PLANNER")

                .antMatchers(HttpMethod.POST, "/api/planner/resource").hasAuthority("PLANNER")

                .antMatchers(HttpMethod.GET, "/api/planner/resources").hasAuthority("PLANNER")

                .antMatchers(HttpMethod.POST, "/api/planner/allocate-resources").hasAuthority("PLANNER")

                .antMatchers(HttpMethod.GET, "/api/staff/event-details/{eventId}").hasAuthority("STAFF")

                .antMatchers(HttpMethod.PUT, "/api/staff/update-setup/{eventId}").hasAuthority("STAFF")

                .antMatchers(HttpMethod.GET, "/api/client/booking-details/{eventId}").hasAuthority("CLIENT")

                .anyRequest().authenticated()

                .and()

                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
 
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

    }
 
    // @Override

    // protected void configure(HttpSecurity http) throws Exception {

    //     http.cors().and().csrf().disable()

    //             .authorizeRequests()

    //             .antMatchers(HttpMethod.POST, "/api/user/register").permitAll()

    //             .antMatchers(HttpMethod.POST, "/api/user/login").permitAll()

    //             .antMatchers(HttpMethod.POST, "/api/planner/event").permitAll()

    //             .antMatchers(HttpMethod.GET, "/api/planner/events").permitAll()

    //             .antMatchers(HttpMethod.POST, "/api/planner/resource").permitAll()

    //             .antMatchers(HttpMethod.GET, "/api/planner/resources").permitAll()

    //             .antMatchers(HttpMethod.POST, "/api/planner/allocate-resources").permitAll()

    //             .antMatchers(HttpMethod.GET, "/api/staff/event-details/{eventId}").permitAll()

    //             .antMatchers(HttpMethod.PUT, "/api/staff/update-setup/{eventId}").permitAll()

    //             .antMatchers(HttpMethod.GET, "/api/client/booking-details/{eventId}").permitAll()

    //             .anyRequest().authenticated()

    //             .and()

    //             .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
 
    //     http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

    // }
 
 
 
    @Bean

    @Override

    public AuthenticationManager authenticationManagerBean() throws Exception {

        return super.authenticationManagerBean();

    }

}
 
// package com.edutech.eventmanagementsystem.config;
 
// import org.springframework.beans.factory.annotation.Autowired;

// import org.springframework.context.annotation.Bean;

// import org.springframework.context.annotation.Configuration;

// import org.springframework.http.HttpMethod;

// import org.springframework.security.authentication.AuthenticationManager;

// import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;

// import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;

// import org.springframework.security.config.annotation.web.builders.HttpSecurity;

// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

// import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

// import org.springframework.security.config.http.SessionCreationPolicy;

// import org.springframework.security.core.userdetails.UserDetailsService;

// import org.springframework.security.crypto.password.PasswordEncoder;

// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
 
// import com.edutech.eventmanagementsystem.jwt.JwtRequestFilter;
 
 
// public class SecurityConfig  {

//         // TODO: implement the security configuration
 
//         // configure CORS and CSRF

//         // configure the routes that are accessible without authentication

//         // configure the routes that are accessible with specific roles

//         // set the permission w.r.t to authorities

//         // - /api/user/register: accessible to everyone

//         // - /api/user/login: accessible to everyone

//         // - /api/planner/event: accessible to PLANNER authority

//         // - /api/planner/events: accessible to PLANNER authority

//         // - /api/planner/resource: accessible to PLANNER authority

//         // - /api/planner/resources: accessible to PLANNER authority

//         // - /api/planner/allocate-resources: accessible to PLANNER authority

//         // - /api/staff/event-details/{eventId}: accessible to STAFF authority

//         // - /api/staff/update-setup/{eventId}: accessible to STAFF authority

//         // - /api/client/booking-details/{eventId}: accessible to CLIENT authority

//         // - any other route: accessible to authenticated users

//         // configure the session management

//         // add the jwtRequestFilter before the UsernamePasswordAuthenticationFilter

// }
 