package nl.notarishoeve8.demo1.rss;

import lombok.extern.log4j.Log4j2;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Controller
@Log4j2
public class RssClient {
    public Feeddata getRssFeed(FeedController rssFeed) throws IOException {
        CloseableHttpClient httpclient = HttpClients.createDefault();
        HttpGet httpget = new HttpGet(rssFeed.getUrl());
        httpget.setHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:72.0) Gecko/20100101 Firefox/72.0");
        CloseableHttpResponse response = httpclient.execute(httpget);
        try {
            return rssFeed.processData(response.getEntity().getContent());
        } finally {
            response.close();
        }
    }
}
