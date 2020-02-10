package nl.notarishoeve8.demo1.rss;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import java.io.IOException;

@Controller
@Log4j2
public class RssService {

    @Autowired
    private RssClient rssClient;

    private static FeedController[] rssFeeds = new FeedController[] {
        new FeedController("Tweakers nieuws", "http://feeds.feedburner.com/tweakers/nieuws"),
        new FeedController("Tweakers mixed", "http://feeds.feedburner.com/tweakers/mixed"),
        new FeedController("Tweakers meuktracker", "http://feeds.feedburner.com/tweakers/meuktracker"),

        new FeedController("nu.nl Algemeen", "https://www.nu.nl/rss/Algemeen"),
        new FeedController("nu.nl Wetenschap", "https://www.nu.nl/rss/Wetenschap"),

//        new FeedController("ncsc advisories", "https://advisories.ncsc.nl/rss/advisories"),
//        new FeedController("cybersecurityalliantie", "https://www.cybersecurityalliantie.nl/rss"),

        new FeedController("security.nl", "https://www.security.nl/rss/headlines.xml"),
        new FeedController("Krantenkoppen", "http://www.krantenkoppen.eu/feed/"),

        new FeedController("JavaWorld", "https://www.javaworld.com/index.rss"),
        new FeedController("Java Code Geeks", "https://www.javacodegeeks.com/feed"),
        new FeedController("Plumbr Java Performance Monitoring", "https://plumbr.io/blog/feed"),
        new FeedController("Java geek", "https://blog.frankel.ch/feed.xml")
    };
    private static int feedCounter = 0;

    public Feeddata getFeeddata() {
        Feeddata result = null;
        FeedController rssFeed = rssFeeds[feedCounter];
        log.info("Processing rss feed {}", rssFeed.getName());
        result = rssClient.getRssFeed(rssFeed);
        if (++feedCounter >= rssFeeds.length) feedCounter = 0;
        return result;
    }
}
