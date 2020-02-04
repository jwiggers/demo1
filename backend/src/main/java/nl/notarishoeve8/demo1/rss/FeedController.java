package nl.notarishoeve8.demo1.rss;

import lombok.extern.log4j.Log4j2;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.*;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.LinkedList;
import java.util.List;

@Log4j2
public class FeedController {

    private static final boolean SAVE_DATA_TO_FILE = true;

    private final String feedId;
    private final String feedUrl;

    private static int fileCnt = 1;

    private String lastMessage;

    FeedController(String feedId, String feedUrl) {
        this.feedId = feedId;
        this.feedUrl = feedUrl;
    }

    String getUrl() {
        return feedUrl;
    }

    private Feeddata filterFeedData(List<String> feedData) {
        String tempLastMessage = null;
        List<String> result = new LinkedList<>();
        for(String data : feedData) {
            if (data.equals(lastMessage)) break;
            if (tempLastMessage == null) tempLastMessage = data;
            result.add(data);
            if (result.size() >= 5) break;
        }
        if (result.isEmpty()) return null;
        if (tempLastMessage != null) {
            lastMessage = tempLastMessage;
        }
        Feeddata data = new Feeddata();
        data.setId(feedId);
        data.setData(result);
        return data;
    }

    public String getName() {
        return feedId;
    }

    public Feeddata processData(InputStream content) {
        if (SAVE_DATA_TO_FILE) {
            String feedData = getDataFromInputStream(content);
            content = saveFeeddata(feedData);
        }
        List<String> data = process(content);
        if (data == null || data.isEmpty()) return null;
        return filterFeedData(data);
    }

    private InputStream saveFeeddata(String data) {
        List<String> result = new LinkedList<>();
        FileOutputStream out = null;
        try {
            String filename = "rssFeed_" + fileCnt++;
            out = new FileOutputStream(filename);
            out.write(data.getBytes());
            out.flush();
        } catch (IOException e) {
            log.error(String.format("Problem writing feeddata to file '%s' - %s ", getName()), e);
        }
        finally {
            if (out != null) {
                try {
                    out.close();
                } catch (IOException e) { /* Doing nothing */ }
            }
        }
        return new ByteArrayInputStream(data.getBytes());
    }

    private String getDataFromInputStream(InputStream content) {
        StringBuilder textBuilder = new StringBuilder();
        try (Reader reader = new BufferedReader(new InputStreamReader
                (content, Charset.forName(StandardCharsets.UTF_8.name())))) {
            int c = 0;
            while ((c = reader.read()) != -1) {
                textBuilder.append((char) c);
            }
        }
        catch(IOException e) {
            log.error(String.format("Problem processing rss data '%s'.", this.feedId), e);
        }
        return textBuilder.toString();
    }

    private static List<String> process(InputStream dataStream) {
        List<String> result = new LinkedList<>();
        try {
            Document doc = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(dataStream);
            NodeList items = doc.getElementsByTagName("item");
            for(int teller = 0; teller < items.getLength(); teller++) {
                Node node = items.item(teller);
                NodeList titles = ((Element)node).getElementsByTagName("title");
                result.add(titles.item(0).getTextContent());
            }
        } catch (SAXException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParserConfigurationException e) {
            e.printStackTrace();
        }
        return result;
    }

}
