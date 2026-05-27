package com.sneha.paysight.dto.response;

import com.sneha.paysight.enums.Category;
import com.sneha.paysight.enums.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;

public class TransactionResponse {

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    @NotNull(message = "Type is required")
    private TransactionType type;

    @NotNull(message = "Category is required")
    private Category category;

    @NotNull(message = "Date is required")
    private LocalDate date;

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
}