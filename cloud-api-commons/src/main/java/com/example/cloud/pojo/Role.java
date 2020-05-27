package com.example.cloud.pojo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
@Getter
@Setter
@ToString
public class Role {
    private Integer uuid;
    private String roleName;
    private String permiss;
    private String createTime;
}
