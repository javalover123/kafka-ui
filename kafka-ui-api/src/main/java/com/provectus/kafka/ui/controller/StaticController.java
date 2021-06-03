package com.provectus.kafka.ui.controller;

import com.provectus.kafka.ui.util.ResourceUtil;
import java.util.concurrent.atomic.AtomicReference;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
@Log4j2
public class StaticController {
  private final ServerProperties serverProperties;

  @Value("classpath:static/index.html")
  private Resource indexFile;
  private final AtomicReference<String> renderedIndexFile = new AtomicReference<>();

  @GetMapping(value = "/index.html", produces = { "text/html" })
  public Mono<ResponseEntity<String>> getIndex() {
    return Mono.just(ResponseEntity.ok(getRenderedIndexFile()));
  }

  public String getRenderedIndexFile() {
    String rendered = renderedIndexFile.get();
    if (rendered == null) {
      rendered = buildIndexFile();
      if (renderedIndexFile.compareAndSet(null, rendered)) {
        return rendered;
      } else {
        return renderedIndexFile.get();
      }
    } else {
      return rendered;
    }
  }

  @SneakyThrows
  private String buildIndexFile() {
    final String contextPath = serverProperties.getServlet().getContextPath() != null
        ? serverProperties.getServlet().getContextPath() : "";
    final String staticPath = contextPath + "/static";
    return ResourceUtil.readAsString(indexFile)
        .replace("href=\"./static", "href=\"" + staticPath)
        .replace("src=\"./static", "src=\"" + staticPath)
        .replace("window.basePath=\"/\"", "window.basePath=\"" + contextPath + "\"");
  }
}
