package com.sneha.paysight.repository;

import com.sneha.paysight.entity.Transaction;
import com.sneha.paysight.enums.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserIdOrderByDateDesc(Long userId);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
            "WHERE t.user.id = :userId AND t.type = :type")
    BigDecimal sumByUserIdAndType(@Param("userId") Long userId,
                                  @Param("type") TransactionType type);

    @Query("SELECT t.category, COALESCE(SUM(t.amount), 0) FROM Transaction t " +
            "WHERE t.user.id = :userId AND t.type = 'EXPENSE' GROUP BY t.category")
    List<Object[]> sumExpenseByCategory(@Param("userId") Long userId);

    @Query("SELECT DATE_FORMAT(t.date, '%Y-%m'), t.type, COALESCE(SUM(t.amount), 0) " +
            "FROM Transaction t WHERE t.user.id = :userId " +
            "GROUP BY DATE_FORMAT(t.date, '%Y-%m'), t.type " +
            "ORDER BY DATE_FORMAT(t.date, '%Y-%m')")
    List<Object[]> monthlyBreakdown(@Param("userId") Long userId);
}