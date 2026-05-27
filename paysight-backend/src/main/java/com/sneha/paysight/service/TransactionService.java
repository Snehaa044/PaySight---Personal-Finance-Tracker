package com.sneha.paysight.service;

import com.sneha.paysight.dto.request.TransactionRequest;
import com.sneha.paysight.dto.response.DashboardResponse;
import com.sneha.paysight.dto.response.TransactionResponse;
import com.sneha.paysight.entity.Transaction;
import com.sneha.paysight.entity.User;
import com.sneha.paysight.enums.TransactionType;
import com.sneha.paysight.exception.ResourceNotFoundException;
import com.sneha.paysight.repository.TransactionRepository;
import com.sneha.paysight.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionService(TransactionRepository transactionRepository,
                              UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private TransactionResponse toResponse(Transaction t) {
        TransactionResponse r = new TransactionResponse();
        r.setId(t.getId());
        r.setDescription(t.getDescription());
        r.setAmount(t.getAmount());
        r.setType(t.getType());
        r.setCategory(t.getCategory());
        r.setDate(t.getDate());
        return r;
    }

    public TransactionResponse create(TransactionRequest request) {
        User user = getCurrentUser();
        Transaction t = Transaction.builder()
                .description(request.getDescription())
                .amount(request.getAmount())
                .type(request.getType())
                .category(request.getCategory())
                .date(request.getDate())
                .user(user)
                .build();
        return toResponse(transactionRepository.save(t));
    }

    public List<TransactionResponse> getAll() {
        User user = getCurrentUser();
        return transactionRepository
                .findByUserIdOrderByDateDesc(user.getId())
                .stream().map(this::toResponse).toList();
    }

    public TransactionResponse update(Long id, TransactionRequest request) {
        User user = getCurrentUser();
        Transaction t = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        if (!t.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        t.setDescription(request.getDescription());
        t.setAmount(request.getAmount());
        t.setType(request.getType());
        t.setCategory(request.getCategory());
        t.setDate(request.getDate());
        return toResponse(transactionRepository.save(t));
    }

    public void delete(Long id) {
        User user = getCurrentUser();
        Transaction t = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        if (!t.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        transactionRepository.delete(t);
    }

    public DashboardResponse getDashboard() {
        User user = getCurrentUser();
        Long uid = user.getId();

        BigDecimal totalIncome = transactionRepository
                .sumByUserIdAndType(uid, TransactionType.INCOME);
        BigDecimal totalExpense = transactionRepository
                .sumByUserIdAndType(uid, TransactionType.EXPENSE);
        BigDecimal balance = totalIncome.subtract(totalExpense);

        Map<String, BigDecimal> expenseByCategory = new LinkedHashMap<>();
        transactionRepository.sumExpenseByCategory(uid)
                .forEach(row -> expenseByCategory.put(
                        row[0].toString(), (BigDecimal) row[1]));

        Map<String, DashboardResponse.MonthlyData> monthMap = new LinkedHashMap<>();
        transactionRepository.monthlyBreakdown(uid).forEach(row -> {
            String month = row[0].toString();
            String type = row[1].toString();
            BigDecimal amount = (BigDecimal) row[2];
            monthMap.computeIfAbsent(month, k -> {
                DashboardResponse.MonthlyData d = new DashboardResponse.MonthlyData();
                d.setMonth(k);
                d.setIncome(BigDecimal.ZERO);
                d.setExpense(BigDecimal.ZERO);
                return d;
            });
            if ("INCOME".equals(type)) monthMap.get(month).setIncome(amount);
            else monthMap.get(month).setExpense(amount);
        });

        DashboardResponse response = new DashboardResponse();
        response.setTotalIncome(totalIncome);
        response.setTotalExpense(totalExpense);
        response.setBalance(balance);
        response.setExpenseByCategory(expenseByCategory);
        response.setMonthlyData(new ArrayList<>(monthMap.values()));
        return response;
    }
}