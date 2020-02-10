package nl.notarishoeve8.demo1.rss;

import lombok.Data;

import java.util.List;

@Data
public class Feeddata {
    private String id;
    private List<String> data;
}
