package com.example.cloud.pojo;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
@Getter
@Setter
@ToString
public class Permiss {
    private Integer uuid;
    private String permissName;
    private String roleName;
    private Integer roleid;
    private String createtime;
}
