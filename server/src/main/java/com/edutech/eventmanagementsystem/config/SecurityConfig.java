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
 
// @Configuration

// @EnableWebSecurity

// @EnableGlobalMethodSecurity(prePostEnabled = true)

// public class SecurityConfig extends WebSecurityConfigurerAdapter {

//     private final UserDetailsService userDetailsService;

//     private final JwtRequestFilter jwtRequestFilter;

//     private final PasswordEncoder passwordEncoder;
 
//     @Autowired

//     public SecurityConfig(UserDetailsService userDetailsService,

//                           JwtRequestFilter jwtRequestFilter,

//                           PasswordEncoder passwordEncoder) {

//         this.userDetailsService = userDetailsService;

//         this.jwtRequestFilter = jwtRequestFilter;

//         this.passwordEncoder = passwordEncoder;

//     }
 
 
//     @Override

//     protected void configure(AuthenticationManagerBuilder auth) throws Exception {

//         auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);

//     }
 
//     @Override

//     protected void configure(HttpSecurity http) throws Exception {

//         http.cors().and().csrf().disable()

//                 .authorizeRequests()
//                 .antMatchers(HttpMethod.POST, "/api/planner/messages").hasAuthority("PLANNER")
// .antMatchers(HttpMethod.GET, "/api/planner/messages/**").hasAuthority("PLANNER")

// // For STAFF
// .antMatchers(HttpMethod.POST, "/api/staff/messages").hasAuthority("STAFF")
// .antMatchers(HttpMethod.GET, "/api/staff/messages/**").hasAuthority("STAFF")
//                 .antMatchers("/api/otp/send","/api/otp/verify").permitAll()

//                 .antMatchers(HttpMethod.POST, "/api/user/reset-password-with-otp").permitAll()
               
//                 .antMatchers(HttpMethod.POST, "/api/user/register").permitAll()

//                 .antMatchers(HttpMethod.POST, "/api/user/login").permitAll()

//                 .antMatchers(HttpMethod.POST, "/api/planner/event").hasAuthority("PLANNER")

//                 .antMatchers(HttpMethod.GET, "/api/planner/events").hasAuthority("PLANNER")

//                 .antMatchers(HttpMethod.POST, "/api/planner/resource").hasAuthority("PLANNER")

//                 .antMatchers(HttpMethod.GET, "/api/planner/resources").hasAuthority("PLANNER")

//                 .antMatchers(HttpMethod.POST, "/api/planner/allocate-resources").hasAuthority("PLANNER")

//                 .antMatchers("/api/users/role/**").permitAll()
                
//                 .antMatchers(HttpMethod.GET, "/api/user/events").permitAll()
                
//                 .antMatchers(HttpMethod.GET, "/api/staff/event-details/{eventId}").hasAuthority("STAFF")

//                 .antMatchers(HttpMethod.PUT, "/api/staff/update-setup/{eventId}").hasAuthority("STAFF")

//                 .antMatchers(HttpMethod.GET, "/api/client/booking-details/{eventId}").hasAuthority("CLIENT")

//                 .anyRequest().authenticated()

//                 .and()

//                 .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
 
//         http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

//     }
 
//     @Bean

//     @Override

//     public AuthenticationManager authenticationManagerBean() throws Exception {

//         return super.authenticationManagerBean();

//     }

// }



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
            
            // PUBLIC ENDPOINTS - NO AUTHENTICATION REQUIRED
            .antMatchers("/api/otp/send", "/api/otp/verify").permitAll()
            .antMatchers(HttpMethod.POST, "/api/user/register").permitAll()
            .antMatchers(HttpMethod.POST, "/api/user/login").permitAll()
            .antMatchers(HttpMethod.POST, "/api/user/reset-password-with-otp").permitAll() 
            .antMatchers("/api/users/role/**").permitAll()
            .antMatchers(HttpMethod.GET, "/api/user/events").permitAll()
            
            // PLANNER ENDPOINTS
            .antMatchers(HttpMethod.POST, "/api/planner/event").hasAuthority("PLANNER")
            .antMatchers(HttpMethod.GET, "/api/planner/events").hasAuthority("PLANNER")
            .antMatchers(HttpMethod.GET, "/api/planner/events/**").hasAuthority("PLANNER")
            .antMatchers(HttpMethod.PUT, "/api/planner/event/**").hasAuthority("PLANNER")
            .antMatchers(HttpMethod.DELETE, "/api/planner/event/**").hasAuthority("PLANNER")
            .antMatchers(HttpMethod.POST, "/api/planner/resource").hasAuthority("PLANNER")
            .antMatchers(HttpMethod.GET, "/api/planner/resources").hasAuthority("PLANNER")
            .antMatchers(HttpMethod.PUT, "/api/planner/resource/**").hasAuthority("PLANNER")
            .antMatchers(HttpMethod.POST, "/api/planner/allocate-resources").hasAuthority("PLANNER")
            .antMatchers(HttpMethod.POST, "/api/planner/messages").hasAuthority("PLANNER")
            .antMatchers(HttpMethod.GET, "/api/planner/messages/**").hasAuthority("PLANNER")
            
            // STAFF ENDPOINTS
            .antMatchers(HttpMethod.GET, "/api/staff/event-details/{eventId}").hasAuthority("STAFF")
            .antMatchers(HttpMethod.PUT, "/api/staff/update-setup/{eventId}").hasAuthority("STAFF")
            .antMatchers(HttpMethod.POST, "/api/staff/messages").hasAuthority("STAFF")
            .antMatchers(HttpMethod.GET, "/api/staff/messages/**").hasAuthority("STAFF")
            
            // CLIENT ENDPOINTS
            .antMatchers(HttpMethod.GET, "/api/client/booking-details/**").hasAuthority("CLIENT")
            .antMatchers(HttpMethod.GET, "/api/client/allEvents").hasAuthority("CLIENT")
            .antMatchers(HttpMethod.GET, "/api/client/event-detailsbyTitleforClient/**").hasAuthority("CLIENT")
            
            // PAYMENT ENDPOINTS
            .antMatchers(HttpMethod.POST, "/api/payment/initiate/**").hasAuthority("CLIENT")
            .antMatchers(HttpMethod.POST, "/api/payment/process-upi/**").hasAuthority("CLIENT")
            .antMatchers(HttpMethod.GET, "/api/payment/calculate/**").hasAuthority("CLIENT")
            .antMatchers(HttpMethod.GET, "/api/payment/**").authenticated()
            
            .anyRequest().authenticated()
            .and()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
            
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}

