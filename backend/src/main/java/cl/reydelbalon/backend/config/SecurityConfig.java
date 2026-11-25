
package cl.reydelbalon.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

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
                                .jwtAuthenticationConverter(
                                        jwtAuthenticationConverter(usuarioRepository))))

                .authorizeHttpRequests(auth -> auth

                        // =====================================================
                        // 1. CATALOGO PUBLICO
                        // =====================================================
                        // Permitir consultar productos y categorias sin iniciar sesion.
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/v1/productos",
                                "/api/v1/productos/**",
                                "/api/v1/categorias",
                                "/api/v1/categorias/**")
                        .permitAll()

                        // =====================================================
                        // 2. AUTENTICACION
                        // =====================================================
                        // Permitir registro, login y renovacion de JWT.
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/v1/auth/registro",
                                "/api/v1/auth/login",
                                "/api/v1/auth/refresh")
                        .permitAll()

                        // Consultar datos del usuario autenticado.
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/v1/auth/me")
                        .authenticated()

                        // =====================================================
                        // 3. VERIFICACION ADMINISTRATIVA
                        // =====================================================
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/v1/admin/verificar")
                        .hasRole("ADMINISTRADOR")

                        // =====================================================
                        // 4. CRUD ADMINISTRATIVO DE PRODUCTOS
                        // =====================================================
                        // Solo ADMINISTRADOR puede crear, modificar,
                        // eliminar y gestionar productos.
                        .requestMatchers(
                                "/api/v1/admin/productos",
                                "/api/v1/admin/productos/**")
                        .hasRole("ADMINISTRADOR")

                        // =====================================================
                        // 5. DASHBOARD ADMINISTRATIVO
                        // =====================================================
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/v1/admin/dashboard/resumen")
                        .hasRole("ADMINISTRADOR")

                        // =====================================================
                        // 6. CONSULTA DE VENTAS Y PEDIDOS
                        // =====================================================
                        // ADMINISTRADOR y VENDEDOR pueden consultar ventas.
                        // No se habilitan operaciones de modificacion.
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/v1/admin/ventas")
                        .hasAnyRole("ADMINISTRADOR", "VENDEDOR")

                        // =====================================================
                        // 7. ADMINISTRACION DE USUARIOS
                        // =====================================================
                        // Solo ADMINISTRADOR puede consultar los usuarios.
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/v1/admin/usuarios")
                        .hasRole("ADMINISTRADOR")

                        // =====================================================
                        // 8. INVENTARIO ADMINISTRATIVO
                        // =====================================================
                        // Solo ADMINISTRADOR puede consultar, modificar
                        // y reponer inventario desde endpoints administrativos.
                        .requestMatchers(
                                "/api/v1/admin/inventario/**")
                        .hasRole("ADMINISTRADOR")

                        // =====================================================
                        // 9. REGISTRO DE COMPRAS - EVA3
                        // =====================================================
                        // CLIENTE: puede registrar compras.
                        // ADMINISTRADOR: conserva acceso total.
                        // VENDEDOR: no puede registrar compras.
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/v1/compras")
                        .hasAnyRole("CLIENTE", "ADMINISTRADOR")

                        // =====================================================
                        // 10. MANEJO DE ERRORES
                        // =====================================================
                        .requestMatchers("/error")
                        .permitAll()

                        // =====================================================
                        // 11. SWAGGER Y OPENAPI
                        // =====================================================
                        // Mantener disponible la documentacion REST.
                        // Los endpoints protegidos siguen requiriendo JWT.
                        .requestMatchers(
                                HttpMethod.GET,
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/v3/api-docs",
                                "/v3/api-docs/**")
                        .permitAll()

                        // =====================================================
                        // 12. DENEGAR ACCESOS NO AUTORIZADOS
                        // =====================================================
                        .anyRequest()
                        .denyAll());

        return http.build();
    }

    // =========================================================
    // CONVERTIR JWT A ROLES DESDE MYSQL
    // =========================================================
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter(
            UsuarioRepository usuarioRepository) {

        JwtAuthenticationConverter converter =
                new JwtAuthenticationConverter();

        converter.setJwtGrantedAuthoritiesConverter(jwt -> {

            String email = jwt.getSubject();

            Usuario usuario = usuarioRepository.findByEmail(email)
                    .orElseThrow(() ->
                            new OAuth2AuthenticationException(
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

    // =========================================================
    // CORS - FRONTEND REACT + VITE
    // =========================================================
    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuracion =
                new CorsConfiguration();

        // Origenes locales permitidos.
        configuracion.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://127.0.0.1:5173"));

        configuracion.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "OPTIONS"));

        configuracion.setAllowedHeaders(List.of(
                "Content-Type",
                "Accept",
                "Authorization"));

        UrlBasedCorsConfigurationSource origen =
                new UrlBasedCorsConfigurationSource();

        origen.registerCorsConfiguration(
                "/api/**",
                configuracion);

        return origen;
    }
}
