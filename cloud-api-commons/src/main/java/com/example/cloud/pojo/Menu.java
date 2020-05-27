package com.example.cloud.pojo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class Menu {
    private Integer uuid;
    private Integer id;
    private Integer parentid;
    private String menuname;
    private String fathername;
    private String url;
    private boolean checked=false;
    private boolean open=true;
    private List<Menu> children;
}
