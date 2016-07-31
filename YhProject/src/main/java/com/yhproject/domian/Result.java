package com.yhproject.domian;

import lombok.Data;

/**
 * Created by HYEYOON on 2016-06-01.
 */
@Data
public class Result {
    private int result;
    private String msg;


    public int getResult() {
        return result;
    }

    public void setResult(int result) {
        this.result = result;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

}
