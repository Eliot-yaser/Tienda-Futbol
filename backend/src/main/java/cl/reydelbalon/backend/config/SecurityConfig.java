
package cl.reydelbalon.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .cors(cors -> cors
                        .configurationSource(corsConfigurationSource()))

                .csrf(csrf -> csrf
                        .ignoringRequestMatchers("/api/**"))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .jwtAuthenticationConverter(jwtAuthenticationConverter())))

                .authorizeHttpRequests(auth -> auth

                        // Permitir consultas publicas del catalogo
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/v1/productos",
                                "/api/v1/productos/**",
                                "/api/v1/categorias",
                                "/api/v1/categorias/**")
                        .permitAll()

                        // Permitir registro e inicio de sesion
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/v1/auth/registro",
                                "/api/v1/auth/login")
                        .permitAll()

                        // Permitir consultar el usuario autenticado
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/v1/auth/me")
                        .authenticated()

                        // Permitir acceso solo a administradores
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/v1/admin/verificar")
                        .hasRole("ADMINISTRADOR")

                        // Bloquear los demas accesos temporalmente
                        .anyRequest().denyAll());

        return http.build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {

        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();

        converter.setJwtGrantedAuthoritiesConverter(jwt -> {

            String rol = jwt.getClaimAsString("rol");

            if (rol == null || !List.of(
                    "CLIENTE",
                    "VENDEDOR",
                    "ADMINISTRADOR").contains(rol)) {
                return List.of();
            }

            return List.of(
                    new SimpleGrantedAuthority("ROLE_" + rol));
        });

        return converter;
    }

    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuracion = new CorsConfiguration();

        // Origenes locales permitidos para React + Vite
        configuracion.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://127.0.0.1:5173"));

        configuracion.setAllowedMethods(List.of("GET", "POST", "OPTIONS"));
        configuracion.setAllowedHeaders(List.of(
                "Content-Type",
                "Accept"));

        UrlBasedCorsConfigurationSource origen = new UrlBasedCorsConfigurationSource();

        origen.registerCorsConfiguration(
                "/api/**",
                configuracion);

        return origen;
    }
}
