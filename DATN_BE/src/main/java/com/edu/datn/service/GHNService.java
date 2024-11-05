// package com.edu.datn.service;

// import org.springframework.http.HttpHeaders;
// import org.springframework.http.HttpEntity;
// import org.springframework.http.HttpMethod;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.stereotype.Service;
// import org.springframework.web.client.RestTemplate;

// @Service
// public class GHNService {

//     private final String ghnUrl = "https://online-gateway.ghn.vn/shiip/public-api/master-data/district";
//     private final String token = "aa348b98-8f64-11ef-98a2-5ee1cfd5578a";

//     // API quận-huyện
//     public ResponseEntity<Object> getDistricts() {
//         RestTemplate restTemplate = new RestTemplate();
//         HttpHeaders headers = new HttpHeaders();
//         headers.set("Token", token);

//         HttpEntity<String> entity = new HttpEntity<>(headers);
//         ResponseEntity<Object> response = restTemplate.exchange(ghnUrl, HttpMethod.GET, entity, Object.class);

//         if (response.getStatusCode() == HttpStatus.OK) {
//             return response; // Trả về toàn bộ ResponseEntity để chứa dữ liệu và trạng thái
//         } else {
//             throw new RuntimeException("Không lấy được dữ liệu từ GHN API");
//         }
//     }

//     // API phường - xã
//     public ResponseEntity<Object> getWards(Long districtId) {
//         String ghnUrl = "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=" + districtId;
//         RestTemplate restTemplate = new RestTemplate();
//         HttpHeaders headers = new HttpHeaders();
//         headers.set("Token", token);

//         HttpEntity<String> entity = new HttpEntity<>(headers);
//         ResponseEntity<Object> response = restTemplate.exchange(ghnUrl, HttpMethod.GET, entity, Object.class);

//         if (response.getStatusCode() == HttpStatus.OK) {
//             return response; // Trả về toàn bộ ResponseEntity để chứa dữ liệu và trạng thái
//         } else {
//             throw new RuntimeException("Không lấy được dữ liệu từ GHN API");
//         }
//     }

//     // API tỉnh thành
//     public Object getProvinces() {
//         RestTemplate restTemplate = new RestTemplate();
//         HttpHeaders headers = new HttpHeaders();
//         headers.set("Token", token);

//         HttpEntity<String> entity = new HttpEntity<>(headers);
//         ResponseEntity<Object> response = restTemplate.exchange(ghnUrl, HttpMethod.GET, entity, Object.class);

//         if (response.getStatusCode().is2xxSuccessful()) {
//             return response.getBody();
//         } else {
//             throw new RuntimeException("Không lấy được dữ liệu từ GHN API");
//         }
//     }

//     // Tương tự, bạn có thể tạo các method khác như tính phí vận chuyển, lấy danh sách tỉnh/thành
// }
package com.edu.datn.service;

import org.springframework.http.HttpHeaders;


import java.util.List;


import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.edu.datn.dto.DistrictDTO;
import com.edu.datn.dto.DistrictResponse;
import com.edu.datn.dto.ProvinceDTO;
import com.edu.datn.dto.ProvinceResponse;

import com.edu.datn.dto.WardDTO;
import com.edu.datn.dto.WardResponse;

@Service
public class GHNService {

    private final String token = "aa348b98-8f64-11ef-98a2-5ee1cfd5578a";
    private final String shopID ="5403071";
    private final String baseUrl = "https://online-gateway.ghn.vn/shiip/public-api/master-data/";
    private final RestTemplate restTemplate = new RestTemplate();

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", token);
        return headers;
    }

    public List<DistrictDTO> getDistricts(Long provinceId) {
        String url = baseUrl + "district?province_id=" + provinceId;
        HttpEntity<String> entity = new HttpEntity<>(createHeaders());

        ResponseEntity<DistrictResponse> response = restTemplate.exchange(url, HttpMethod.GET, entity, DistrictResponse.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            return response.getBody().getData(); // Giả sử bạn có phương thức getData() trong DistrictResponse
        } else {
            throw new RuntimeException("Không lấy được dữ liệu từ GHN API cho quận/huyện");
        }
    }

    public List<WardDTO> getWards(Long districtId) {
        String url = baseUrl + "ward?district_id=" + districtId;
        HttpEntity<String> entity = new HttpEntity<>(createHeaders());

        ResponseEntity<WardResponse> response = restTemplate.exchange(url, HttpMethod.GET, entity, WardResponse.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            return response.getBody().getData(); // Giả sử bạn có phương thức getData() trong WardResponse
        } else {
            throw new RuntimeException("Không lấy được dữ liệu từ GHN API cho phường/xã");
        }
    }

    public List<ProvinceDTO> getProvinces() {
        String url = baseUrl + "province";
        HttpEntity<String> entity = new HttpEntity<>(createHeaders());

        ResponseEntity<ProvinceResponse> response = restTemplate.exchange(url, HttpMethod.GET, entity, ProvinceResponse.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            return response.getBody().getData(); // Giả sử bạn có phương thức getData() trong ProvinceResponse
        } else {
            throw new RuntimeException("Không lấy được dữ liệu từ GHN API cho tỉnh/thành phố");
        }
    }


}



