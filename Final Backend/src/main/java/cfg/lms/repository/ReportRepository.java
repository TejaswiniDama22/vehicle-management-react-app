package cfg.lms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cfg.lms.entity.Report;
@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
	boolean existsByUserUserId(Long userId);
}