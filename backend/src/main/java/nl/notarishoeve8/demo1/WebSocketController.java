package nl.notarishoeve8.demo1;

import com.google.gson.Gson;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
@Log4j2
public class WebSocketController {

    private ColumnData[] chartdata = new ColumnData[]{
            new ColumnData("Ja", 0),new ColumnData("Beetje", 0),new ColumnData("Nee", 0)
    };

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @Autowired
    private Counter counter;

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
        chartdata[column].value++;
        return chartdata;
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