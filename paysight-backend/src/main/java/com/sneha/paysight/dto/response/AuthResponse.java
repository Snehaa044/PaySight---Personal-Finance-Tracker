package com.sneha.paysight.dto.response;

public class AuthResponse {

    private String token;
    private String email;
    private String fullName;
    private String role;

    public AuthResponse() {}

    public AuthResponse(String token, String email, String fullName, String role) {
        this.token = token;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
    }

    public String getToken() { return token; }
    public void setToken(String v) { this.token = v; }
    public String getEmail() { return email; }
    public void setEmail(String v) { this.email = v; }
    public String getFullName() { return fullName; }
    public void setFullName(String v) { this.fullName = v; }
    public String getRole() { return role; }
    public void setRole(String v) { this.role = v; }
}