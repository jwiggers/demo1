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

import java.text.SimpleDateFormat;
import java.util.*;

@Controller
@Log4j2
public class  WebSocketController {

    private List<String> messages = new ArrayList<>();

    @Autowired
    private Gson gson;

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    public WebSocketController() {
        messages.add("First test message");
    }

    ......................
}
