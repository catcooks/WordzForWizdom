import java.io.*;
import java.util.*;

public class JsonSorterManual {
    public static void main(String[] args) {
        String inputFile = "dictionary.json";
        String outputFile = "sorted_dictionary.json";

        try {
            // Read file into a single string
            StringBuilder sb = new StringBuilder();
            try (BufferedReader br = new BufferedReader(new FileReader(inputFile))) {
                String line;
                while ((line = br.readLine()) != null) {
                    sb.append(line.trim());
                }
            }

            String json = sb.toString();

            // Remove outer braces
            if (json.startsWith("{") && json.endsWith("}")) {
                json = json.substring(1, json.length() - 1).trim();
            } else {
                System.out.println("Invalid JSON format");
                return;
            }

            // Split by commas safely
            String[] items = json.split(",");

            List<Map.Entry<String, Integer>> entries = new ArrayList<>();

            for (String item : items) {
                item = item.trim();
                if (item.isEmpty()) continue; // skip empty items (like trailing comma)
                String[] kv = item.split(":", 2);
                if (kv.length != 2) continue;
                String key = kv[0].trim().replaceAll("^\"|\"$", "");
                String value = kv[1].trim().replaceAll("^\"|\"$", "");
                entries.add(new AbstractMap.SimpleEntry<>(key, Integer.parseInt(value)));
            }

            // Sort by length of key
            entries.sort(Comparator.comparingInt(e -> e.getKey().length()));

            // Write sorted JSON
            try (BufferedWriter bw = new BufferedWriter(new FileWriter(outputFile))) {
                bw.write("{\n");
                int count = 0;
                for (Map.Entry<String, Integer> entry : entries) {
                    bw.write("  \"" + entry.getKey() + "\": " + entry.getValue());
                    count++;
                    if (count < entries.size()) {
                        bw.write(",");
                    }
                    bw.write("\n");
                }
                bw.write("}");
            }

            System.out.println("Sorted JSON by key length saved to " + outputFile);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
