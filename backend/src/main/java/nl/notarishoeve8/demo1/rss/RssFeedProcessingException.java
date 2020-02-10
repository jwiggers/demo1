package nl.notarishoeve8.demo1.rss;

public class RssFeedProcessingException extends RuntimeException {
    public RssFeedProcessingException(String message, Throwable e) {
        super(message,e);
    }
}
