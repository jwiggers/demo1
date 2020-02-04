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

        new FeedController("cybersecurityalliantie", "https://www.cybersecurityalliantie.nl/rss"),

        new FeedController("Krantenkoppen", "http://www.krantenkoppen.eu/feed/"),

        new FeedController("JavaWorld", "https://feeds.feedspot.com/?followfeedid=3609361"),
        new FeedController("Java Code Geeks", "https://feeds.feedspot.com/?followfeedid=4430903"),
        new FeedController("Plumbr Java Performance Monitoring", "https://feeds.feedspot.com/?followfeedid=4430904"),
        new FeedController("Java geek", "https://feeds.feedspot.com/?followfeedid=4528220")
    };
    private static int feedCounter = 0;

    public Feeddata getFeeddata() {
        Feeddata result = null;
        FeedController rssFeed = rssFeeds[feedCounter];
        try {
            result = rssClient.getRssFeed(rssFeed);
        } catch (IOException e) {
            log.error(String.format("Problem processing rss feed '%s'.", rssFeeds[feedCounter].getName()), e);
        }
        if (++feedCounter >= rssFeeds.length) feedCounter = 0;
        return result;
    }
}
