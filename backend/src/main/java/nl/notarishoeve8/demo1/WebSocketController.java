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

    @MessageExceptionHandler
    @SendTo("/topic/errors")
    public String handleException(Throwable exception) {
        return exception.getMessage();
    }

    @Scheduled(initialDelay = 5000, fixedRate = 5000)
    private void DecreaseTimer() {
        messagingTemplate.convertAndSend("/topic/counter", counter.decay());
    }
}