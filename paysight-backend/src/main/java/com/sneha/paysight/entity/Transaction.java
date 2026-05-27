package com.sneha.paysight.entity;

import com.sneha.paysight.enums.Category;
import com.sneha.paysight.enums.TransactionType;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "transactions", indexes = {
        @Index(name = "idx_user_id", columnList = "user_id"),
        @Index(name = "idx_category", columnList = "category"),
        @Index(name = "idx_date", columnList = "date")
})
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(nullable = false)
    private LocalDate date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Transaction() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDescription() { return description; }
    public void setDescription(String v) { this.description = v; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal v) { this.amount = v; }
    public TransactionType getType() { return type; }
    public void setType(TransactionType v) { this.type = v; }
    public Category getCategory() { return category; }
    public void setCategory(Category v) { this.category = v; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate v) { this.date = v; }
    public User getUser() { return user; }
    public void setUser(User v) { this.user = v; }

    public static TransactionBuilder builder() { return new TransactionBuilder(); }

    public static class TransactionBuilder {
        private String description;
        private BigDecimal amount;
        private TransactionType type;
        private Category category;
        private LocalDate date;
        private User user;

        public TransactionBuilder description(String v) { this.description = v; return this; }
        public TransactionBuilder amount(BigDecimal v) { this.amount = v; return this; }
        public TransactionBuilder type(TransactionType v) { this.type = v; return this; }
        public TransactionBuilder category(Category v) { this.category = v; return this; }
        public TransactionBuilder date(LocalDate v) { this.date = v; return this; }
        public TransactionBuilder user(User v) { this.user = v; return this; }

        public Transaction build() {
            Transaction t = new Transaction();
            t.description = this.description;
            t.amount = this.amount;
            t.type = this.type;
            t.category = this.category;
            t.date = this.date;
            t.user = this.user;
            return t;
        }
    }
}