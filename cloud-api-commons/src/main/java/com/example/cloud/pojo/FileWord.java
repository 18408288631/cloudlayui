package com.example.cloud.pojo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileWord {
    private Integer uuid;
    private Integer useruuid;
    private String useraccount;
    private String filename;
    private String createtime;
}
