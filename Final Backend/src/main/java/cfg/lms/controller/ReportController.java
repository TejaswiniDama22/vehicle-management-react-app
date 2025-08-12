package cfg.lms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import cfg.lms.dto.ReportRequest;
import cfg.lms.entity.Report;
import cfg.lms.repository.ReportRepository;
import cfg.lms.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/report")
@RequiredArgsConstructor
public class ReportController {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;


@PostMapping("/submit")
public ResponseEntity<ResponseData> submitReport(@Valid @RequestBody ReportRequest request) {
    ResponseData response = new ResponseData();

    try {
        if (reportRepository.existsByUserUserId(request.getUserId())) {
            response.setStatus("ERROR");
            response.setMessage("Report already submitted for this user ID: " + request.getUserId());
            response.setData(null);
            return ResponseEntity.badRequest().body(response);
        }

        Report report = new Report();
        report.setDescription(request.getDescription());
        report.setUser(userRepository.findById(request.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found")));

        Report savedReport = reportRepository.save(report);

        response.setStatus("SUCCESS");
        response.setData(savedReport);
        return ResponseEntity.ok(response);

    } catch (Exception e) {
        response.setStatus("ERROR");
        response.setMessage("Report submission failed: " + e.getMessage());
        response.setData(null);
        return ResponseEntity.internalServerError().body(response);
    }
}
}