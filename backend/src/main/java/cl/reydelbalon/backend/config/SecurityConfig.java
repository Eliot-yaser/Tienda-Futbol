
package cl.reydelbalon.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.http.SessionCreationPolicy;

import cl.reydelbalon.backend.entity.Usuario;
import cl.reydelbalon.backend.repository.UsuarioRepository;

import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;

import java.util.List;

@Configuration
public class SecurityConfig {

        @Bean

        public SecurityFilterChain securityFilterChain(
                        HttpSecurity http,
                        UsuarioRepository usuarioRepository) throws Exception {

                http
                                .cors(cors -> cors
                                                .configurationSource(corsConfigurationSource()))

                                .csrf(csrf -> csrf
                                                .ignoringRequestMatchers("/api/**"))
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                                .oauth2ResourceServer(oauth2 -> oauth2
                                                .jwt(jwt -> jwt
                                                                .jwtAuthenticationConverter(jwtAuthenticationConverter(
                                                                                usuarioRepository))))

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
                                                                "/api/v1/auth/login",
                                                                "/api/v1/auth/refresh")
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

                                                // Proteger todas las operaciones del CRUD administrativo
                                                .requestMatchers("/api/v1/admin/productos",
                                                                "/api/v1/admin/productos/**")
                                                .hasRole("ADMINISTRADOR")

                                                // Permitir consultar el dashboard solo a administradores
                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/api/v1/admin/dashboard/resumen")
                                                .hasRole("ADMINISTRADOR")

                                                // Permitir consultar el historial de ventas
                                                // exclusivamente a administradores
                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/api/v1/admin/ventas")
                                                .hasRole("ADMINISTRADOR")

                                                // Permitir consultar los usuarios registrados
                                                // exclusivamente a administradores
                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/api/v1/admin/usuarios")
                                                .hasRole("ADMINISTRADOR")

                                                // Proteger todas las operaciones del inventario
                                                // Solo administradores: consultar, modificar y reponer
                                                .requestMatchers(
                                                                "/api/v1/admin/inventario/**")
                                                .hasRole("ADMINISTRADOR")


                                                .requestMatchers(HttpMethod.POST, "/api/v1/compras").authenticated()

                                                .requestMatchers("/error").permitAll()

                                                // Bloquear los demas accesos temporalmente
                                                .anyRequest().denyAll());

                return http.build();
        }

        @Bean

        public JwtAuthenticationConverter jwtAuthenticationConverter(
                        UsuarioRepository usuarioRepository) {

                JwtAuthenticationConverter converter = new JwtAuthenticationConverter();

                converter.setJwtGrantedAuthoritiesConverter(jwt -> {

                        String email = jwt.getSubject();

                        Usuario usuario = usuarioRepository.findByEmail(email)
                                        .orElseThrow(() -> new OAuth2AuthenticationException(
                                                        new OAuth2Error("invalid_token"),
                                                        "Usuario no encontrado"));

                        if (!Boolean.TRUE.equals(usuario.getActivo())) {
                                throw new OAuth2AuthenticationException(
                                                new OAuth2Error("invalid_token"),
                                                "Usuario inactivo");
                        }

                        return List.of(
                                        new SimpleGrantedAuthority(
                                                        "ROLE_" + usuario.getRol().name()));
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

                configuracion.setAllowedMethods(
                                List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

                configuracion.setAllowedHeaders(List.of(
                                "Content-Type",
                                "Accept",
                                "Authorization"));

                UrlBasedCorsConfigurationSource origen = new UrlBasedCorsConfigurationSource();

                origen.registerCorsConfiguration(
                                "/api/**",
                                configuracion);

                return origen;
        }
}
