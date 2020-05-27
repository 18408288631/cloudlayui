package com.example.cloud.pojo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PersonVip {
    private Integer uuid;
    private String employeeName;
    private String employeeVipName;
    private String identity;
    private Integer employeeVip;
    private String createTime;
}
