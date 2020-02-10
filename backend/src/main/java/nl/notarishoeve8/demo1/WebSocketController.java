package nl.notarishoeve8.demo1;

import com.google.gson.Gson;
import lombok.extern.log4j.Log4j2;
import nl.notarishoeve8.demo1.rss.Feeddata;
import nl.notarishoeve8.demo1.rss.RssFeedProcessingException;
import nl.notarishoeve8.demo1.rss.RssService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Controller
@Log4j2
public class  WebSocketController {

    private ColumnData[][] columnData = new ColumnData[][] {
            new ColumnData[] { new ColumnData("Ja", 18), new ColumnData("Beetje", 7), new ColumnData("Nee", 5) },
            new ColumnData[] { new ColumnData("1", 0), new ColumnData("2", 3), new ColumnData("3", 8), new ColumnData("4", 12), new ColumnData("5", 3) },
            new ColumnData[] { new ColumnData("1", 1), new ColumnData("2", 0), new ColumnData("3", 2), new ColumnData("4", 0), new ColumnData("5", 3),
                    new ColumnData("6", 7), new ColumnData("7", 11), new ColumnData("8", 15), new ColumnData("9", 8), new ColumnData("10", 3)},
            new ColumnData[] { new ColumnData("Ja", 15), new ColumnData("Nee", 7) }
    };

    private ChartData[] chartData = new ChartData[] {
            new ChartData("Enquete","Ja, Nee, Beetje", columnData[0]),
            new ChartData("Enquete","1 ... 5", columnData[1]),
            new ChartData("Enquete","1 ... 10", columnData[2]),
            new ChartData("Enquete","Ja Nee", columnData[3])
    };

    private List<String> users = new ArrayList<>();
    private ColumnData[] currentColumnData;

    public WebSocketController() {

    }

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @Autowired
    private Counter counter;

    @Autowired
    private RssService rssService;

    @MessageMapping("/message")
    @SendTo("/topic/demo")
    public String processMessageFromClient(@Payload String message) throws Exception {
        return new Gson().fromJson(message, Map.class).get("text").toString();
    }

    @MessageMapping("/counter")
    @SendTo("/topic/counter")
    public Integer processCounterFromClient(@Payload String json) throws Exception {
        String direction = new Gson().fromJson(json, Map.class).get("direction").toString();
        return direction.equalsIgnoreCase("up") ? counter.up() : counter.down();
    }

    @MessageMapping("/stemmen")
    @SendTo("/topic/stemmen")
    public ColumnData[] processStemmen(@Payload String json) throws Exception {
        int column = new Gson().fromJson(json, int.class);
        currentColumnData[column].value++;
        return currentColumnData;
    }

    @MessageMapping("/chartConfig")
    @SendTo("/topic/chartConfig")
    public ChartData selectChart(@Payload String json) throws Exception {
        int type = new Gson().fromJson(json, int.class);
        currentColumnData = cloneColumnData(columnData[type]);
        return chartData[type];
    }

    @MessageMapping("/user")
    @SendTo("/topic/users")
    public List<String> userLoggedOn(@Payload String user) throws Exception {
        users.add(user);
        Collections.sort(users);
        return users;
    }

    @MessageMapping("/userLoggedOff")
    @SendTo("/topic/users")
    public List<String> userLoggedOff(@Payload String user) throws Exception {
        users.remove(user);
        Collections.sort(users);
        return users;
    }

    private ColumnData[] cloneColumnData(ColumnData[] columnDatum) {
        ColumnData[] result = new ColumnData[columnDatum.length];
        for(int x = 0; x < columnDatum.length; x++) {
            result[x] = new ColumnData(columnDatum[x].label, 0);
        }
        return result;
    }

    @MessageExceptionHandler
    @SendTo("/topic/errors")
    public String handleException(Throwable exception) {
        return exception.getMessage();
    }

    private int previousCounterValue = -1;
    @Scheduled(initialDelay = 5000, fixedRate = 5000)
    private void DecreaseTimer() {
        int newValue = counter.decay();
        if (previousCounterValue != 0 || newValue != 0) {
            previousCounterValue = newValue;
            messagingTemplate.convertAndSend("/topic/counter", newValue);
        }
    }

    @Scheduled(initialDelay = 10000, fixedRate = 60000)
    private void readRssFeed() {
        Feeddata feedData = null;
        try {
            feedData = rssService.getFeeddata();
            if (feedData != null) {
                messagingTemplate.convertAndSend("/topic/news", feedData);
            }
        } catch (RssFeedProcessingException e) {
            log.error("Problem processing rss feed.", e);
            handleException(e);
        }
    }
}

class ChartData {
    public ChartCaption chart = new ChartCaption();
    public ColumnData[] data =new ColumnData[] {new ColumnData("Ja", 18), new ColumnData("Beetje", 7), new ColumnData("Nee", 5), };

    public ChartData(String title, String subTitle, ColumnData[] columnDatum) {
        this.chart.caption = title;
        this.chart.subCaption = subTitle;
        this.data = columnDatum;
    }
}
class ChartCaption {
    public String caption = "Enquete";
    public String subCaption = "bla die bla";
    public String xAxisName = "Keuzes";
    public String yAxisName = "aantal";
    public String numberSuffix = "";
    public String theme = "fusion";
}
class ColumnData {
    public String label;
    public int value = 0;

    public ColumnData() {
    }

    public ColumnData(String label, int v) {
        this.label = label;
        this.value = v;
    }
}