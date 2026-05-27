package com.sneha.paysight.entity;

import com.sneha.paysight.enums.Role;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String fullName;

    @Enumerated(EnumType.STRING)
    private Role role = Role.ROLE_USER;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Transaction> transactions = new ArrayList<>();

    public User() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public List<Transaction> getTransactions() { return transactions; }
    public void setTransactions(List<Transaction> transactions) { this.transactions = transactions; }

    public static UserBuilder builder() { return new UserBuilder(); }

    public static class UserBuilder {
        private String email, password, fullName;
        private Role role = Role.ROLE_USER;

        public UserBuilder email(String v) { this.email = v; return this; }
        public UserBuilder password(String v) { this.password = v; return this; }
        public UserBuilder fullName(String v) { this.fullName = v; return this; }
        public UserBuilder role(Role v) { this.role = v; return this; }

        public User build() {
            User u = new User();
            u.email = this.email;
            u.password = this.password;
            u.fullName = this.fullName;
            u.role = this.role;
            return u;
        }
    }
}