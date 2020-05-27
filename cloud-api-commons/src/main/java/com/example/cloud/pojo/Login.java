package com.example.cloud.pojo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class Login {
    private String useraccount;
    private String roleName;
    private String password;
    private Integer uuid;
    private String identity;
    private String area;
    private Integer roleuuid;
    private String createTime;
}
