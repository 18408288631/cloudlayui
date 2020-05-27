package com.example.cloud.pojo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DayLog {
    private Integer uuid;
    private String images;
    private String daylog;
    private Integer useruuid;
    private String useraccount;
    private String createTime;
    private String endTime;
}
