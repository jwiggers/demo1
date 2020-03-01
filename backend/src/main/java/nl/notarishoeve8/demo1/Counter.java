package nl.notarishoeve8.demo1;

public class Counter {
	private Integer counter = 0;

	public Integer up() {
		return counter>20?20:++counter;
	}

	public Integer down() {
		return counter<-20?-20:--counter;
	}

	public Integer decay() {
		if (counter > 0) return --counter;
		if (counter < 0) return ++counter;
		return 0;
	}
}
