package com.lab.rent.filter;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ApartmentsFilter {
    private Boolean freeWiFi;
    private Boolean conditioner;
    private Boolean bathroom;
}
