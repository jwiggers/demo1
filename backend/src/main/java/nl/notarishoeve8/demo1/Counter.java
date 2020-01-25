package nl.notarishoeve8.demo1;

public class Counter {
	private Integer counter = 0;

	public Integer up() {
		return ++counter;
	}

	public Integer down() {
		return --counter;
	}

	public Integer decay() {
		if (counter > 0) return --counter;
		if (counter < 0) return ++counter;
		return 0;
	}
}
