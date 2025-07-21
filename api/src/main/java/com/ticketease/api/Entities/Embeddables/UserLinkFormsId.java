package com.ticketease.api.Entities.Embeddables;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserLinkFormsId implements Serializable {

	@Column(name = "user_id")
	private Long userId;

	@Column(name = "form_id")
	private Long formId;

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (!(o instanceof UserLinkFormsId that))
			return false;
		return Objects.equals(userId, that.userId) && Objects.equals(formId, that.formId);
	}

	@Override
	public int hashCode() {
		return Objects.hash(userId, formId);
	}
}
