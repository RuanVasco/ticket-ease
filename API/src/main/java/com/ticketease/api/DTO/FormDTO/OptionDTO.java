package com.ticketease.api.DTO.FormDTO;

import com.ticketease.api.Entities.Option;

public record OptionDTO(String label, String value) {
  public static OptionDTO from(Option option) {
    return new OptionDTO(option.getLabel(), option.getValue());
  }

  public Option toEntity() {
    return new Option(label, value);
  }
}
