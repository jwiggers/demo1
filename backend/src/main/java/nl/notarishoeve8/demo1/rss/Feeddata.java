package nl.notarishoeve8.demo1.rss;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Feeddata {
    private String id;
    private List<String> data;
}
